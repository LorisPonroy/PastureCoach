import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import getLastAndCurrentWalkData from '../Services/getLastAndCurrentWalkData';
import { faR } from '@fortawesome/free-solid-svg-icons';

function useFarmData() {
    const { farmID } = useParams();
    const navigate = useNavigate();

    const [editingsDatas, setEditingsDatas] = useState({
        user: JSON.parse(window.sessionStorage.getItem("user")).email,
        upload: [],
    });
    const [walksData, setWalksData] = useState(null);
    const [averageCover, setAverageCover] = useState(null);
    const [farm, setFarm] = useState(null);
    const [readings, setReadings] = useState([]);
    const [reload, setReload] = useState(0);

    const reloadData = () => {
        setReload(prev => prev + 1); // Incrémentation pour déclencher useEffect
    };

    useEffect(() => {
        const farms = JSON.parse(window.sessionStorage.getItem("farms"));
        const farmFound = farms.find(farm => farm.farmid == farmID);
        const readingsLoaded = JSON.parse(window.sessionStorage.getItem("readings"));
        const storedData = window.localStorage.getItem("editingsDatas");

        setFarm(farmFound);
        setReadings(readingsLoaded);
        setEditingsDatas(storedData ? JSON.parse(storedData) : {
            user: JSON.parse(window.sessionStorage.getItem("user")).email,
            upload: [],
        });
    }, [reload]);

    useEffect(() => {
        if (farm && readings.length > 0 && editingsDatas) {
            const walks = getLastAndCurrentWalkData(farm, readings, editingsDatas)[farmID];
            setWalksData(walks);
            if (walks && walks.length > 0) {
                setAverageCover(walks.map(paddock => paddock.lastWalk?.cover || 0).reduce((acc, n) => acc + n, 0) / walks.length);
            }
        }
    }, [farm, readings, editingsDatas, farmID]);

    useEffect(() => {
        if (editingsDatas) {
            window.localStorage.setItem('editingsDatas', JSON.stringify(editingsDatas));
        }
    }, [editingsDatas]);

    const resetEditingsData = ()=>{
        setEditingsDatas({
            user: JSON.parse(window.sessionStorage.getItem("user")).email,
            upload: [],
        });
    }

    return {
        farm,
        readings,
        editingsDatas,
        setEditingsDatas,
        walksData,
        setWalksData,
        averageCover,
        setAverageCover,
        resetEditingsData,
        reloadData
    };
}

export default useFarmData;