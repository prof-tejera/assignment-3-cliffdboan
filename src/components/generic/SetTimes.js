const minuteArr = [];
for (let i = 0; i <= 30; i++) {
    minuteArr.push(i);
};

const secArr = [];
for (let i = 0; i <= 60; i += 5) {
    secArr.push(i);
};

const SetTimes = ({ minId, secId, onChangeMin, onChangeSec, hideMins, work, rest }) => {
    return (
        <div>
            <label htmlFor="mins" style={{ display: hideMins ? 'none' : '' }}>Min: </label>
            <select name="mins" onChange={onChangeMin} id={minId} defaultValue={0} style={{ display: hideMins ? 'none' : '' }}>
                {minuteArr.map((num) => {
                    return <option key={num + "_min"} value={num}>{num}</option>
                })}
            </select>
            <br style={{ display: hideMins ? 'none' : '' }} />
            <label htmlFor="secs" style={{ display: work ? 'none' : '' || rest ? 'none' : '' }}>Sec: </label>
            <label htmlFor="secs" style={{ display: work ? '' : 'none' }}>Work Sec: </label>
            <label htmlFor="secs" style={{ display: rest ? '' : 'none' }}>Rest Sec: </label>
            <select name="secs" onChange={onChangeSec} id={secId} defaultValue={0}>
                {secArr.map((sec) => {
                    return <option key={sec + "_sec"} value={sec}>{sec}</option>
                })}
            </select>
        </div>
    );
};

export default SetTimes;
