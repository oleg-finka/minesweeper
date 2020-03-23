import React from 'react';
import Game from './Game/Game';
import styles from './App.module.scss';

export default class App extends React.Component {
    render() {
        return (
            <div className={styles.app}>
                <Game />
            </div>
        );
    }
}
