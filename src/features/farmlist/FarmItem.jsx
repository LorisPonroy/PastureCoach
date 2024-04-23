import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function FarmItem({ farm }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/farm/${farm.farmid}`);
    };

    return (
        <Container
            style={{
                padding: '10px',
                border: 'solid 1px black',
                marginBottom: '5px',
                boxShadow: '5px 2px 2px rgba(200,200,200,0.9)',
                cursor: 'pointer'
            }}
            onClick={handleClick}
        >
            {farm.farmname}
        </Container>
    );
}

export default FarmItem;
