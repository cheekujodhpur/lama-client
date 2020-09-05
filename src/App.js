import React, { Component } from 'react';
import { Client } from 'boardgame.io/react';

import Lama from "./Lama";

const App = Client({
    game: Lama,
});

export default App;
