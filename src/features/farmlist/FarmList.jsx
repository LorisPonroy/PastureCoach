import React from 'react';
import { Container, ListGroup } from 'react-bootstrap';
import FarmItem from './FarmItem';
import { useNavigate } from 'react-router-dom';
import RegionSummary from '../partials/RegionSummary';
var inspect = require('util-inspect');

function FarmList() {
  const navigate = useNavigate();
  const user = JSON.parse(window.sessionStorage.getItem("user"));
  const farms = JSON.parse(window.sessionStorage.getItem("farms"));

  return (
    <Container>
      <h2>Region summary</h2>
      <RegionSummary />
      <h2>Your farms</h2>
      <ListGroup>
        {farms.map((farm, index) => (
          <FarmItem key={farm.farmid} farm={farm} />
        ))}
      </ListGroup>
    </Container>
  );
}

export default FarmList;
