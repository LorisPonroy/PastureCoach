export default function getLastAndCurrentWalkData(farm, readings, editingsData) {
    // Prepare an object to store the computed data
    let walksData = {};

    // Parse editingsData if it's a string, otherwise use it directly
    const parsedEditingsData = typeof editingsData === 'string' ? JSON.parse(editingsData) : editingsData;

    // Iterate through each paddock of the farm to collect initial data
    let paddockDataArray = farm.paddocks.map(paddock => {
        // Initialize paddock data
        let paddockData = {
            paddockId: paddock.paddockid,
            paddockName: paddock.paddockname,
            lastWalk: null,
            currentWalk: null, // Initialize currentWalk here
        };

        // Filter readings specifically for this paddock
        let paddockReadings = readings.flatMap(readingGroup =>
            readingGroup.filter(reading =>
                reading.farmid === farm.farmid && reading.paddockid === paddock.paddockid
            )
        );

        // Sort readings by 'readingnum' to get the most recent
        paddockReadings.sort((a, b) => b.readingnum - a.readingnum);

        // If readings exist, set the lastWalk to the most recent reading
        if (paddockReadings.length > 0) {
            paddockData.lastWalk = paddockReadings[0]; // The most recent reading
        }

        // Find the corresponding upload for this paddock
        let currentUpload = parsedEditingsData.upload.find(upload =>
            upload.farmid === farm.farmid && upload.paddockid === paddock.paddockid
        );

        // If a corresponding upload exists, set currentWalk with its attributes
        if (currentUpload) {
            paddockData.currentWalk = currentUpload;
        }

        return paddockData;
    });

    // Sort the paddock data array by 'walkorder' from the farm.paddocks object before adding it to walksData
    paddockDataArray.sort((a, b) => {
        const paddockA = farm.paddocks.find(p => p.paddockid === a.paddockId);
        const paddockB = farm.paddocks.find(p => p.paddockid === b.paddockId);
        return paddockA.walkorder - paddockB.walkorder;
    });

    // Store the sorted data in walksData
    walksData[farm.farmid] = paddockDataArray;

    return walksData;
}