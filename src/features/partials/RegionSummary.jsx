import React, { useState, useEffect } from 'react';
import { Container, Table, Form } from 'react-bootstrap';
import inspect from 'util-inspect';

function RegionSummary() {
    const [data, setData] = useState(null);
    const [selectedPeriod, setSelectedPeriod] = useState('');
    const [error, setError] = useState("");
    useEffect(() => {
        const handleSuccess = (responseJson) => {
            setData(responseJson);
            if (responseJson && responseJson.length > 0) {
                setSelectedPeriod(responseJson[0].period);
            }
        };

        const handleError = (error) => {
            console.error("Error fetching data: ", error);
            setError(`Error: ${error.message ? error.message : 'Unknown error'}`);
        };

        if (window.cordova) {
            cordova.plugin.http.setDataSerializer('json');
            cordova.plugin.http.get("http://pasturecoachnz.co.nz/api/growth_summaries/weekly", {}, {}, response => { handleSuccess(JSON.parse(response.data)) }, error => {
                handleError(new Error(`Cordova error: ${JSON.stringify(error)}`));
            });
        } else {
            fetch('/summary/growth_summaries/weekly')
                .then(response => response.json())
                .then(handleSuccess)
                .catch(handleError);
        }
    }, []);

    const handlePeriodChange = (event) => {
        setSelectedPeriod(event.target.value);
    };

    if (!data) {
        return <div>{error ? inspect(error) : "Loading..."}</div>;
    }

    let currentEntry = null;
    if (Array.isArray(data)) {
        currentEntry = data.find(entry => entry.period === selectedPeriod);
    } else {
        console.error("Data is not an array:", inspect(data));
    }

    return (
        <Container fluid className="no-margins">
            <style>{`
            @media (max-width: 576px) {
                .full-width-sm {
                    width: 100%;
                    max-width: 100%;
                    margin-left: 0;
                    margin-right: 0;
                }
                .no-margins {
                    padding-left: 0;
                    padding-right: 0;
                }
            }   
            `}</style>
            <Form.Group controlId="periodSelect">
                <Form.Label>Select Period:</Form.Label>
                <Form.Control as="select" value={selectedPeriod} onChange={handlePeriodChange} className="full-width-sm">
                    {data.map((entry, index) => (
                        <option key={index} value={entry.period}>
                            {entry.period}
                        </option>
                    ))}
                </Form.Control>
            </Form.Group>

            {currentEntry ? (
                <div className="mt-4 ">
                    <Table striped bordered hover size="sm" style={{fontSize:"0.7em"}}>
                        <thead>
                            <tr>
                                <th>Region</th>
                                <th>Average Cover (KgDM/ha)</th>
                                <th>Average Growth (KgDM/day)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentEntry.items.map((region, idx) => (
                                <tr key={idx}>
                                    <td style={{textOverflow:'ellipsis', wordWrap:"break-word", wordBreak:'break-all'}}>{region.region_name}</td>
                                    <td>{region.average_cover}</td>
                                    <td>{region.average_growth}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            ) : (
                <div>No data available for selected period.</div>
            )}
        </Container>
    );
}

export default RegionSummary;
