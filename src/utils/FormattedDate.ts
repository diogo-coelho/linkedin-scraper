'use strict'

/**
 * Classe responsável por formatar a data informada para
 * o padrão dd/mm/aaaa - hh:mm:ss
 */
class FormattedDate {
    public _date: Date
    public _formattedDate: string

    constructor () {
        this._date = new Date()
        this._formattedDate = this.setFormattedDate()
    }

    /**
     * Método que formata a data atual para o formato dd/mm/aaaa - hh:mm:ss
     */
    private setFormattedDate (): string {
        const day = ('0' + this._date.getDate()).slice(-2)
        const month = ('0' + (this._date.getMonth() + 1)).slice(-2)
        const year = this._date.getFullYear()

        const shortDate = `${ day }/${ month }/${ year }`         
        return `${ shortDate } - ${ this._date.getHours() }:${ this._date.getMinutes() }:${ this._date.getSeconds() }`
    }

    public get formattedDate (): string {
        return this._formattedDate
    }
}

export default new FormattedDate()