import React, { Component } from 'react'
import styles from './Cell.module.scss';

type Props = {
    value: number;
    onCellClick: () => void;
}

export default class Cell extends Component<Props> {
    formatCell(val: number) {
        return val === 0 || val === -2 ? ' ' : val;
    }

    getCellClasses() {
        let res = [styles.button];
        if (this.props.value === -2) {
            res.push(styles.dark);
        }
        return res.join(' ');
    }

    render() {
        return (
            <button className={this.getCellClasses()} type="button" onClick={this.props.onCellClick}>
                {this.formatCell(this.props.value)}
            </button>
        )
    }
}
