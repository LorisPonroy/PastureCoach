import React, { useState, useEffect } from 'react';
import { Form, Container } from 'react-bootstrap';

const RotationCalculator = () => {
  const [preGraze, setInput1] = useState(null);
  const [residual, setInput2] = useState(null);
  const [cows, setInput3] = useState(null);
  const [area, setInput4] = useState(null);
  const [speed, setInput5] = useState(null);

  const [calculatedValue1, setCalculatedValue1] = useState(0);
  const [calculatedValue2, setCalculatedValue2] = useState(0);

  useEffect(() => {
    const pastureAllowance = Math.floor(((preGraze - residual) * (area / speed)) / cows);
    const pastureGrowth = Math.floor((preGraze - residual) / speed);

    setCalculatedValue1(pastureAllowance);
    setCalculatedValue2(pastureGrowth);
  }, [preGraze, residual, cows, area, speed]);

  return (
    <Container>
      <h2>Rotation Calculator</h2>
      <h3><span className="badge text-bg-secondary">Pasture Allowance : {calculatedValue1.toFixed(2)} Kg/Cows</span></h3>
      <h3><span className="badge text-bg-secondary">Pasture Growth : {calculatedValue2.toFixed(2)}</span></h3>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Pre-graze</Form.Label>
          <Form.Control type="number" placeholder='Cover' value={preGraze} onChange={(e) => setInput1(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Residual</Form.Label>
          <Form.Control type="number" placeholder='Cover' value={residual} onChange={(e) => setInput2(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>No. of Cows</Form.Label>
          <Form.Control type="number" placeholder='Cows' value={cows} onChange={(e) => setInput3(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Milking Ha. in Rotation</Form.Label>
          <Form.Control type="number" placeholder='Area' value={area} onChange={(e) => setInput4(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Rotation Speed</Form.Label>
          <Form.Control type="number" placeholder='Days' value={speed} onChange={(e) => setInput5(e.target.value)} />
        </Form.Group>
      </Form>
    </Container>
  );
};

export default RotationCalculator;
