import React from 'react';

function GrowthInput({ currentWalk, walkDate, lastWalk, paddockId, handleWalkChange }) {
    let growthIsAcceptable = true;
    let reason = "";
    if(!currentWalk.cover){
        growthIsAcceptable = false;
        reason = "Set cover to check acceptability"
    }
    if (!lastWalk) {
        growthIsAcceptable = false;
        reason = "There's no last walk";
    } else {
        const lastWalkDate = new Date(lastWalk.dateread);
        const daysSinceLastWalk = Math.floor(((walkDate||new Date()) - lastWalkDate) / (1000 * 60 * 60 * 24));
        const growth = Math.floor((currentWalk.cover - lastWalk.cover) / daysSinceLastWalk);
        if (daysSinceLastWalk > 30) {
            growthIsAcceptable = false;
            reason = "Growth can't be accepted if there's too much time between the last walk and the walk date.";
        } else if (growth < 0) {
            growthIsAcceptable = false;
            reason = "Negative growth is unacceptable.";
        }
    }

    return (
        <div>
            <input 
                type='checkbox'
                className='me-2'
                onChange={(e) => handleWalkChange(paddockId, 'acceptGrowth', e.target.checked ? 1 : 0)}
                disabled={!growthIsAcceptable}
            />
            <span style={growthIsAcceptable?{}:{textDecoration:"line-through"}}><b>Accept growth: </b>{currentWalk.growth || "___"} KgDM/days</span><br />
            <span style={{ color: "red" }}>{reason}</span>
        </div>
    );
}

export default GrowthInput;