// Add helpers here. This is usually code that is just JS and not React code. Example: write a function that
// calculates number of minutes when passed in seconds. Things of this nature that you don't want to copy/paste
// everywhere.

export const makeId = () => {
    var result = '';
    var characters = 'QWERTYUIOPLKJHGFDSAZXCVBNMmnbvcxzasdfghjklpoiuytrewq1234567890';
    var characterLength = characters.length;
    for (var i = 0; i < 20; i++) {
        result += characters.charAt(Math.floor(Math.random() * characterLength));
    }
    return result;
};


export const secToClock = (totalTime) => {
    const minutes = Math.floor(totalTime / 60);
    const seconds = totalTime % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}
