const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configurações dos drones
const DRONE_CAPACITY_KG = 10;
const DRONE_MAX_DISTANCE_KM = 20;

// Função para calcular distância
function distance(p1, p2) {
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}

// Função para alocar pedidos em drones
function allocateDrones(orders) {
  const priorityMap = { alta: 3, media: 2, baixa: 1 };
  orders.sort((a, b) => priorityMap[b.priority] - priorityMap[a.priority]);

  const drones = [];

  for (const order of orders) {
    let allocated = false;

    // Tenta alocar em um drone existente
    for (const drone of drones) {
      const totalWeight = drone.orders.reduce((sum, o) => sum + o.weight, 0) + order.weight;
      if (totalWeight > DRONE_CAPACITY_KG) continue;

      const points = drone.orders.map(o => ({ x: o.x, y: o.y }));
      points.push({ x: order.x, y: order.y });

      let dist = distance({ x: 0, y: 0 }, points[0]);
      for (let i = 0; i < points.length - 1; i++) {
        dist += distance(points[i], points[i + 1]);
      }
      dist += distance(points[points.length - 1], { x: 0, y: 0 });

      if (dist <= DRONE_MAX_DISTANCE_KM) {
        drone.orders.push(order);
        drone.distance = dist;
        allocated = true;
        break;
      }
    }

    if (!allocated) {
      const dist = 2 * distance({ x: 0, y: 0 }, { x: order.x, y: order.y });
      if (order.weight <= DRONE_CAPACITY_KG && dist <= DRONE_MAX_DISTANCE_KM) {
        drones.push({ orders: [order], distance: dist });
      } else {
        drones.push({ orders: [order], distance: dist, error: 'Pedido não pode ser entregue' });
      }
    }
  }

  return drones;
}

app.post('/allocate', (req, res) => {
  const orders = req.body.orders;
  if (!orders || !Array.isArray(orders)) {
    return res.status(400).json({ error: 'Orders inválidos' });
  }

  const drones = allocateDrones(orders);
  res.json({ drones });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Backend rodando na porta ${PORT}`);
});
