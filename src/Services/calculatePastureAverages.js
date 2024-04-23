export default function calculatePastureAverages(upload) {
    // Initialize an object to hold aggregate data for each farm
    let farms = {};

    // Loop through each sample in the upload array
    upload.forEach(sample => {
        // If the farm does not exist in the farms object, initialize it
        if (!farms[sample.farmid]) {
            farms[sample.farmid] = {
                totalCover: 0, // Sum of all cover values for this farm
                totalGrowth: 0, // Sum of all growth values where growth is accepted
                countGrowth: 0, // Number of samples where growth is accepted
                totalArea: 0, // Sum of the area of all paddocks for this farm
                readingnum: sample.readingnum, // Latest reading number, will be overwritten by each sample
                date: sample.date, // Latest date, will be overwritten by each sample
            };
        }

        // Reference the current farm's data
        let farm = farms[sample.farmid];

        // Accumulate total cover and area for the farm
        farm.totalCover += sample.cover * sample.area;
        farm.totalArea += sample.area;

        // If growth is accepted, accumulate growth and increment growth count
        if (sample.acceptGrowth === 1) {
            farm.totalGrowth += sample.growth;
            farm.countGrowth++;
        }
    });

    // Map each farm's aggregated data to the averages format
    let averages = Object.keys(farms).map(farmid => {
        let farm = farms[farmid];
        return {
            farmid: parseInt(farmid, 10), // Convert farmid to a number just in case
            cover: Math.round(farm.totalCover / farm.totalArea), // Calculate average cover
            growth: farm.countGrowth > 0 ? Math.round(farm.totalGrowth / farm.countGrowth) : 0, // Calculate average growth, guard against division by zero
            readingnum: farm.readingnum, // Use the last reading number
            date: farm.date // Use the last date
        };
    });

    // Return the averages array
    return averages;
}