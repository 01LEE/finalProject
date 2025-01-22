import Map from './map'; 
import { useNavigate } from 'react-router-dom';
import UsedCarBoard from './usedCarBoard';
export default function Home() {
    const navigate = useNavigate();

    const handleButtonClick = () => {
        navigate('/usedcar-board');



};
    return (
        <div>
            <h1>Home</h1>
            <button onClick={handleButtonClick}>내차 구매하기</button>
            <Map />
        </div>
    );
}