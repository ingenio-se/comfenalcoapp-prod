import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Axios from 'axios';

export default class AutocompleteDescripcion extends Component {
    constructor(props) {
        super(props);
        this.items = [];
        this.state = {
            suggestions: [],
            text: '',
            codigo: '',
            capitulo: '',
            diasMaximos: 0,
        };
        this.onTextChanged = this.onTextChanged.bind(this);
        this.suggestionSelected = this.suggestionSelected.bind(this);
    }

    onTextChanged(e) {
        const value = e.target.value;
        let suggestions = [];
        if (value.length >= 4) {
            let url = 'search/diagnostico/' + value;
            Axios.get(url)
                .then(resp => {
                    suggestions = resp.data.data;
                    this.setState({
                        suggestions: suggestions,
                    });
                })
                .catch(err => {
                    console.log(err);
                });
        }
        this.setState({
            suggestions: suggestions,
            text: value,
        });
    }

    suggestionSelected(item) {
        // Use dynamic field names depending on data received:
        const diag = item.descripcion_diagnostico || item.titulo_cie11 || '';
        const codigo = item.codigo || item.codigo_cie11 || '';
        const capitulo = item.capitulo_grupo || item.capitulo_cie11 || '';
        // For diasMaximos (for CIE10), default to 0 if not provided.
        const diasMaximos = item.num_dias_maximo_solicitud || 0;

        // Determine whether to append or set fresh.
        let newDiag, newCodigo;
        const currentText = this.state.text.trim();
        const currentCodigo = this.state.codigo.trim();

        // If the text ends with "&", then append new values.
        if (currentText.slice(-1) === "&") {
            newDiag = currentText + " " + diag;
            newCodigo = currentCodigo + "&" + codigo.trim();
        } else if (currentText.includes("&")) {
            // Optionally, if the text already contains "&" but does not end with it, append as well.
            newDiag = currentText + " & " + diag;
            newCodigo = currentCodigo + "&" + codigo.trim();
        } else {
            newDiag = diag;
            newCodigo = codigo.trim();
        }

        this.setState({
            suggestions: [],
            text: newDiag,
            codigo: newCodigo,
            capitulo: capitulo,
            diasMaximos: diasMaximos,
        });
        
        // Pass the updated values back to the parent component.
        this.props.handleDiagnostico(newDiag);
        this.props.handleCodigoDiagnostico(newCodigo);
        this.props.handleCapituloDiagnostico(capitulo);
        this.props.handleMaximosCie10(diasMaximos);
    }

    renderSuggestions() {
        const { suggestions } = this.state;
        if (suggestions.length === 0) {  // fixed typo: "length"
            return null;
        }
        return (
            <ul>
                {suggestions.map((item) => {
                    // Use dynamic field for display:
                    const displayText = item.descripcion_diagnostico || item.titulo_cie11;
                    return (
                        <li key={item.id} onClick={() => this.suggestionSelected(item)}>
                            {displayText}
                        </li>
                    );
                })}
            </ul>
        );
    }

    render() {
        const { text, codigo } = this.state;
        const { error, mensaje, title } = this.props;
        return (
            <div className="row">
                <div className="col-sm-10">
                    <div className="form-group">
                        <label htmlFor="descripcionDiagnostico">{ title }</label>
                        <div className="AutoCompleteDescripcion">
                            <input
                                value={text}
                                onChange={this.onTextChanged}
                                type="text"
                                id="descripcionDiagnostico"
                                className="form-control"
                            />
                            {this.renderSuggestions()}
                            <div className={error}>
                                <div className={"redf " + (error || "")}>{ mensaje }</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-sm-2">
                    <div className="form-group">
                        <label htmlFor="codigoDiagnostico">Código</label>
                        <input
                            type="text"
                            name="codigoDiagnostico"
                            id="codigoDiagnostico"
                            className="form-control"
                            value={codigo}
                            readOnly
                        />
                    </div>
                </div>
            </div>
        );
    }
}