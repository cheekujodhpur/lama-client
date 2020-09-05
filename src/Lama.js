function setupDeck() {
    // We need 56 cards, 8 sets of 1..7
    let array = [1, 2, 3, 4, 5, 6, 7];
    // 2 * 2 * 2 = 8
    for (var i = 0; i < 3; i++) {
        array = array.concat(array)
    }
    return array;
}

const Lama = {
    name: "lama",

    setup: () => ({
        deck: setupDeck()
    }),

    moves: {
        drawCard(G, ctx, id) {
            console.log("Drawing");
        },
        fold(G, ctx, id) {
            console.log("Folding");
        },
    },
};

export default Lama;
