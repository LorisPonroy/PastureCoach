import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, CardHeader, CardBody, Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { apiCall } from '../Services/apiService';
import inspect from 'util-inspect';
import GrowthInput from './partials/GrowthInput';
import useFarmData from '../hooks/useFarmData';
import calculatePastureAverages from '../Services/calculatePastureAverages';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactDatePicker from 'react-datepicker';
import { format } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';


const FarmPage = ({ }) => {
    const {
        farm,
        readings,
        editingsDatas,
        setEditingsDatas,
        walksData,
        setWalksData,
        averageCover,
        resetEditingsData,
        reloadData
    } = useFarmData();
    const navigate = useNavigate();
    const { farmID } = useParams();
    const user = JSON.parse(window.sessionStorage.getItem("user"));
    const [currentIndex, setCurrentIndex] = useState(0);
    const [walkDate, setWalkDate] = useState(null);

    const goToNextPaddock = () => {
        if (currentIndex < walksData.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const goToPreviousPaddock = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleWalkChange = (paddockId, field, value) => {
        const newEditingsDatas = { ...editingsDatas };
        const uploadIndex = newEditingsDatas.upload.findIndex(upload => upload.paddockid === paddockId);
        const lastWalkData = walksData.find(paddock => paddock.paddockId === paddockId);
        if (uploadIndex !== -1) {
            newEditingsDatas.upload[uploadIndex] = { ...newEditingsDatas.upload[uploadIndex], [field]: value };
            if (lastWalkData.lastWalk) {
                const currentUpload = newEditingsDatas.upload[uploadIndex];
                const lastWalkDate = new Date(lastWalkData.lastWalk.dateread);
                const daysSinceLastWalk = Math.floor((new Date() - lastWalkDate) / (1000 * 60 * 60 * 24));
                let growth = Math.max(Math.floor((currentUpload.cover - lastWalkData.lastWalk?.cover) / daysSinceLastWalk), 0);
                newEditingsDatas.upload[uploadIndex] = { ...currentUpload, growth: growth };
            }
            setEditingsDatas(newEditingsDatas);
            window.localStorage.setItem('editingsDatas', JSON.stringify(newEditingsDatas));
        }
    };

    const handleAddWalk = () => {
        const newEditingsDatas = { ...editingsDatas };
        const readingnumMax = readings[0].reduce((acc, r) => r.readingnum > acc ? r.readingnum : acc, 0);
        farm.paddocks.forEach((paddock => {
            newEditingsDatas.upload.push({
                farmid: farm.farmid,
                farmname: farm.farmname,
                walkorder: paddock.walkorder,
                paddockid: paddock.paddockid,
                paddockname: paddock.paddockname,
                cover: 0,
                totalCover: 0,
                acceptGrowth: 0,
                growth: 0,
                date: new Date().toISOString(),
                readingnum: (readingnumMax || 0) + 1,
                area: paddock.effectivearea,
            });
        }));

        setEditingsDatas(newEditingsDatas);
    }

    const handleSaveWalk = () => {
        const newEditingsDatas = { ...editingsDatas };
        newEditingsDatas.averages = JSON.stringify(calculatePastureAverages(editingsDatas.upload));

        editingsDatas.upload.forEach(item => { if (item.growth == null || isNaN(item.growth) || !isFinite(item.growth)) item.growth = 0; });
        if (walkDate)
            editingsDatas.upload.forEach(item => { item.date = walkDate.toISOString(); });
        newEditingsDatas.upload = JSON.stringify(editingsDatas.upload);
        newEditingsDatas.password = user.password;
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };
        apiCall(newEditingsDatas, headers,
            (responseJson) => {
                if (responseJson.uhoh) {
                    console.log(responseJson.message);
                } else {
                    if (responseJson.reject.length > 0) {
                        alert("save rejected by the server");
                        window.localStorage.removeItem("editingsDatas");
                        resetEditingsData();
                    } else {
                        window.sessionStorage.setItem("farms", JSON.stringify(responseJson.farms));
                        window.sessionStorage.setItem("readings", JSON.stringify(responseJson.readings));
                        window.localStorage.removeItem("editingsDatas");
                        resetEditingsData();
                        reloadData();
                    }
                }
            },
            (error) => {
                console.log(error);
            }
        );
    }

    const dropCurrentEditing = () => {
        if (confirm("Are you sure to delete your's current walk editings ?")) {
            window.localStorage.removeItem("editingsDatas");
            resetEditingsData();
        }
    }

    if (!farm || !walksData)
        return <></>

    return (
        <Container>
            <h1>{farm.farmname}</h1>
            <h2>Calculators</h2>

            <Row className="d-flex">
                <Container className='item-container responsive-fill responsive-ms-5 responsive-me-5' onClick={() => navigate(`/farm/${farmID}/tools/pastureCalculator/`)} style={{ cursor: 'pointer' }}>
                    <img src="/icon_calculator.png" className="img-fluid rounded-start" alt="calculator icon" style={{ height: '2rem' }} />
                    <span>Pasture Calculator</span>
                </Container>
                <Container className='item-container responsive-fill responsive-ms-5 responsive-me-5' onClick={() => navigate(`/farm/${farmID}/tools/rotationCalculator/`)} style={{ cursor: 'pointer' }}>
                    <img src="/icon_calculator.png" className="img-fluid rounded-start" alt="calculator icon" style={{ height: '2rem' }} />
                    <span>Rotation Calculator</span>
                </Container>
            </Row>
            <style>
                {`
                    .item-container {
                        width : auto;
                        padding: 10px;
                        border: solid 1px black;
                        margin-bottom: 5px;
                        box-shadow: 5px 2px 2px rgba(200,200,200,0.9);
                        cursor: pointer;
                    }
                    @media (max-width: 767.98px) { /* Bootstrap sm breakpoint */
                        .responsive-fill {
                            flex: 1 1 auto;
                        }
                        .responsive-ms-5 {
                            margin-left: 3rem; /* Bootstrap's ms-5 margin */
                        }
                        .responsive-me-5 {
                            margin-right: 3rem; /* Bootstrap's me-5 margin */
                        }
                    }
                `}
            </style>
            <div>
                <h2 className='mt-3'>Paddocks</h2>
                <div className='d-flex flex-column mb-2'>
                    <div className='d-flex flex-fill'>
                        <Button className='btn-sm btn-danger' onClick={() => { dropCurrentEditing() }}>Delete current walk</Button>
                        <div className='ms-auto'>
                            <ReactDatePicker
                                withPortal
                                selected={walkDate ? walkDate : new Date()}
                                onChange={(date) => setWalkDate(date)}
                                customInput={<Button className='btn-sm btn-secondary ms-auto'><FontAwesomeIcon icon={faCalendar} /> {walkDate ? format(walkDate, 'dd/MM/yyyy') : "Today"}</Button>}
                            />
                            <Button className='btn-sm btn-success ms-auto' onClick={() => { handleSaveWalk() }}>Save Walks</Button>
                        </div>
                    </div>
                    <div className='d-flex flex-fill mt-2 m-sm-auto'>
                        <Button className='btn-sm flex-fill' onClick={goToPreviousPaddock} disabled={currentIndex === 0}>« Previous</Button>
                        <Button className='btn-sm flex-fill ms-2' onClick={goToNextPaddock} disabled={currentIndex === walksData.length - 1}>Next »</Button>
                    </div>
                </div>

                <span style={{ textAlign: 'right', right: 0, display: 'block' }}>Last walks average cover : {Math.floor(averageCover)} </span>
                <Card className='mb-3'>
                    <CardHeader className='d-flex justify-content-between align-items-center'>
                        <b>{walksData[currentIndex].paddockName}</b>
                        <span>Area :  {farm.paddocks.find((paddock) => paddock.paddockid === walksData[currentIndex].paddockId).effectivearea} ha</span>
                    </CardHeader>
                    <CardBody>
                        <Container>
                            <Row>
                                <Col xs={12} md={6} className="mb-2 mb-md-0">
                                    <Card style={{ flexGrow: 1 }}>
                                        <CardHeader className={`d-flex justify-content-between align-items-center ${walksData[currentIndex].currentWalk ? 'text-bg-warning' : ''}`}>
                                            Current
                                            <div>
                                                {
                                                    walksData[currentIndex].currentWalk ?
                                                        <></>
                                                        :
                                                        <Button className='btn-sm' onClick={() => { handleAddWalk() }}>Start New Walk</Button>
                                                }
                                            </div>
                                        </CardHeader>
                                        <CardBody>
                                            {
                                                walksData[currentIndex].currentWalk ? (
                                                    <div>
                                                        <span><b>Cover : </b><br className='d-lg-none' /><input type="number" placeholder='KgDM/ha' value={walksData[currentIndex].currentWalk.cover} onChange={(e) => handleWalkChange(walksData[currentIndex].paddockId, 'cover', parseInt(e.target.value))} /></span><br />
                                                        <span><b>Residual : </b><br className='d-lg-none' /><input type="number" placeholder='KgDM/ha' value={walksData[currentIndex].currentWalk.residual} onChange={(e) => handleWalkChange(walksData[currentIndex].paddockId, 'residual', parseInt(e.target.value))} /></span><br />
                                                        <GrowthInput
                                                            currentWalk={walksData[currentIndex].currentWalk}
                                                            lastWalk={walksData[currentIndex].lastWalk}
                                                            paddockId={walksData[currentIndex].paddockId}
                                                            handleWalkChange={handleWalkChange}
                                                        />
                                                    </div>
                                                ) : (
                                                    "No data for current walk"
                                                )
                                            }
                                        </CardBody>
                                    </Card>
                                </Col>
                                <Col xs={12} md={6}>
                                    <Card style={{ flexGrow: 1 }}>
                                        <CardHeader>Last Walk</CardHeader>
                                        <CardBody>
                                            {
                                                walksData[currentIndex].lastWalk ? (
                                                    <div>
                                                        <span>Walk date: {walksData[currentIndex].lastWalk.dateread}</span><br />
                                                        <span>Cover: {walksData[currentIndex].lastWalk.cover} KgDM/ha</span>
                                                    </div>
                                                ) : (
                                                    "No Data for a last walk"
                                                )
                                            }
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                        </Container>
                    </CardBody>
                </Card>
            </div>
        </Container>
    );
};

export default FarmPage;
