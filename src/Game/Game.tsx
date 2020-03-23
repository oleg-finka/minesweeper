import React, { FormEvent } from 'react';
import styles from './Game.module.scss';
import { observable, action, runInAction } from 'mobx';
import { observer } from 'mobx-react';
import Cell from '../Cell/Cell';

type StartGameResponse = {
    status: string,
    game: {
        height: number;
        width: number;
        count: number;
        id: number;
    }
}

type CellData = {
    x: number;
    y: number;
    count: number;
};

type RevealResponse = {
    status: string;
    cells: CellData[];
};

const baseUrl = "http://fathomless-peak-55967.herokuapp.com";
const gamePath = "/games";
const revealPath = (id: number) => `/games/${id}/reveal`;

const width = 10;
const height = 10;
const minesCount = 10;

/*
flags
-2      not defined
-1      this cell is a bomb
0       this cell is empty
N > 0   this cell has N bombs immediately adjacent to it
*/

@observer
export default class Game extends React.Component {
    @observable
    field: number[][] = [];

    @observable
    loading: boolean = false;

    id: number = 0;

    @action
    startGame() {
        this.loading = true;

        fetch(baseUrl + gamePath,
            {
                method: "POST",
                body: JSON.stringify({
                    height, width, count: minesCount
                })
                ,
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then(r => r.json())
            .then((startResult: StartGameResponse) => {
                runInAction(() => {
                    this.field = [];
                    for (let i = 0; i < width; i++) {
                        this.field[i] = [];
                        for (let j = 0; j < height; j++) {
                            this.field[i][j] = -2;
                        }
                    }

                    this.id = startResult.game.id;
                    this.loading = false;
                });
            })

    }

    @action
    handleCellClick(x: number, y: number) {
        this.openCell(x, y);
    }

    @action
    openCell(x: number, y: number) {
        return fetch(baseUrl + revealPath(this.id),
            {
                method: "POST",
                body: JSON.stringify({
                    x, y
                })
                ,
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then(r => r.json())
            .then((res: RevealResponse) => {
                runInAction(() => {
                    let newField = this.field.map((row, i) => row.map((cell, j) => {
                        const cellUpdate = res.cells.find(rc => rc.x === i && rc.y === j);
                        return cellUpdate ? cellUpdate.count : cell;
                    }));

                    this.field = newField;
                });
            });
    }

    @action
    showAll() {
        this.field.forEach((row, i) => row.forEach((cell, j) => this.openCell(i, j)));
    }

    render() {
        return (
            <div className={styles.game}>
                <button className={styles.startButton} onClick={() => this.startGame()}>Start the game</button>
                <button className={styles.startButton} onClick={() => this.showAll()}>Show all</button>

                {this.loading && (<span>Loading</span>)}

                {this.field.map((row, i) => <div key={i}>
                    {row.map((val, j) => <Cell key={j} value={val} onCellClick={() => this.handleCellClick(i, j)} />)}
                </div>)}
            </div>
        );
    }
}
