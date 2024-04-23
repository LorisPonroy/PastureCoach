import React, { useState, useEffect } from 'react';
import { Form, Container } from 'react-bootstrap';

const PastureCalculator = () => {
  const [preGraze, setInput1] = useState(null);
  const [residual, setInput2] = useState(null);
  const [cows, setInput3] = useState(null);
  const [area, setInput4] = useState(null);

  const [calculatedValue1, setCalculatedValue1] = useState(0);

  useEffect(() => {
    const dmPerCow = Math.floor((preGraze - residual) * area / cows);
    setCalculatedValue1(dmPerCow);
  }, [preGraze, residual, cows, area]);

  return (
    <Container>
      <h2>Rotation Calculator</h2>
      <h3><span className="badge text-bg-secondary">DM per Cow : {calculatedValue1.toFixed(2)} Kg/Cows</span></h3>
      <Form>
      <Form.Group className="mb-3">
          <Form.Label>Milking Ha. in Rotation</Form.Label>
          <Form.Control type="number" placeholder='Area' value={area} onChange={(e) => setInput4(e.target.value)} />
        </Form.Group>
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
      </Form>
    </Container>
  );
};

export default PastureCalculator;
