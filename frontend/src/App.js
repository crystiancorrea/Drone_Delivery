import React, { useState } from 'react';
import axios from 'axios';

const PRIORITIES = ['baixa', 'media', 'alta'];

function App() {
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ x: '', y: '', weight: '', priority: 'baixa' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function addOrder() {
    if (
      form.x === '' ||
      form.y === '' ||
      form.weight === '' ||
      isNaN(form.x) ||
      isNaN(form.y) ||
      isNaN(form.weight) ||
      Number(form.weight) <= 0
    ) {
      alert('Preencha os campos corretamente');
      return;
    }
    setOrders([
      ...orders,
      {
        x: Number(form.x),
        y: Number(form.y),
        weight: Number(form.weight),
        priority: form.priority,
      },
    ]);
    setForm({ x: '', y: '', weight: '', priority: 'baixa' });
  }

  async function allocate() {
    if (orders.length === 0) {
      alert('Adicione pelo menos um pedido');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:4000/allocate', { orders });
      setResult(res.data);
    } catch (err) {
      alert('Erro ao alocar drones');
    }
    setLoading(false);
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Drone Delivery</h1>

      <div className="card p-4 mb-4">
        <h4>Adicionar Pedido</h4>
        <div className="row g-3 align-items-center">
          <div className="col-md-2">
            <input
              type="number"
              className="form-control"
              placeholder="Horizontal (X)"
              name="x"
              value={form.x}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-2">
            <input
              type="number"
              className="form-control"
              placeholder="Vertical (Y)"
              name="y"
              value={form.y}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-3">
            <input
              type="number"
              className="form-control"
              placeholder="Peso (kg)"
              name="weight"
              value={form.weight}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-3">
            <select
              className="form-select"
              name="priority"
              value={form.priority}
              onChange={handleChange}
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <button className="btn btn-primary w-100" onClick={addOrder}>
              Adicionar
            </button>
          </div>
        </div>
      </div>

      <h4>Pedidos</h4>
      {orders.length === 0 && <p>Nenhum pedido adicionado.</p>}
      {orders.length > 0 && (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>X</th>
              <th>Y</th>
              <th>Peso (kg)</th>
              <th>Prioridade</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{o.x}</td>
                <td>{o.y}</td>
                <td>{o.weight}</td>
                <td>{o.priority}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button className="btn btn-success my-3" onClick={allocate} disabled={loading}>
        {loading ? 'Alocando...' : 'Alocar Drones'}
      </button>

      {result && (
        <div className="card p-4">
          <h4>Resultado da Alocação</h4>
          {result.drones.map((drone, i) => (
            <div key={i} className="mb-3">
              <h5>Viagem {i + 1} {drone.error && <span className="badge bg-danger">{drone.error}</span>}</h5>
              <p>Distância total: {drone.distance.toFixed(2)} km</p>
              <p>Pedidos:</p>
              <ul>
                {drone.orders.map((o, idx) => (
                  <li key={idx}>
                    Localização: ({o.x}, {o.y}), Peso: {o.weight} kg, Prioridade: {o.priority}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
