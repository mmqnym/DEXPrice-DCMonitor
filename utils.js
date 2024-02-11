const fetchPrice = async () => {
    priceUsd = -1;

    try {
        const response = await fetch(
        `https://api.dexscreener.com/latest/dex/pairs/${process.env.CHAIN}/${process.env.PAIR_HASH}`
        );
        const data = await response.json();
        priceUsd = data.pair.priceUsd;

    } catch (error) {
        console.log(error);
    }

    return priceUsd;
}

module.exports = { fetchPrice };