const fetchPairData = async () => {
    let data = null;

    try {
        const response = await fetch(
        `https://api.dexscreener.com/latest/dex/pairs/${process.env.CHAIN}/${process.env.PAIR_HASH}`
        );
        data = await response.json();

    } catch (error) {
        console.log(error);
    }

    return data;
}

module.exports = { fetchPairData };