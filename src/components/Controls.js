import React, { useState} from 'react';
import useForm from "../hooks/useForm";
//import { nanoid } from 'nanoid';

export const Controls = (props) => {

    const [{ values, loading }, handleChange, handleSubmit] = useForm();
    const [listItens, setListItens] = useState([
        {id:1, nome: "CARREGANDO....", titulo: "teste" },
        
    ]);


    const updateRequest = new FormData(); 
    updateRequest.append('nome', values.nome);
    updateRequest.append('titulo', values.titulo);
    updateRequest.append('mapa', window.localStorage.getItem('world'));

    const enviarContato = () => {
        var url = 'https://rodrigo-kulb.com.br/api-minecraft/cadastrarDados.php';
        fetch(url, {
          method: 'POST',
          body: updateRequest,
          headers:{
           
          }
        }).then(res => res.json())
        .then(response => {
            console.log('Sucesso:', response);

        })
        .catch(error => console.error('Error:', error));
        setDivSalvar(false); setDivMapas(false);
      console.log(values);
    };

    function carregaMapaNovo(chave) 
    {
        //alert(chave);
        setDivMapas(true); 
        setDivSalvar(false);  

        var url = 'https://rodrigo-kulb.com.br/api-minecraft/pegarDados.php?id='+chave;
        fetch(url, {
          method: 'GET',
          headers:{
            
          }
        }).then(res => res.json())
        .then(async response => {

            window.localStorage.setItem('world', JSON.stringify(response));
            window.location.reload();
        })
        .catch(error => console.error('Error:', error));

      window.localStorage.setItem('world', '[{"key":"pZfLFg_KwE-D8seR-aMMs","pos":[-2,1,5],"texture":"dirt"},{"key":"gjtVOcrzI-3C66LYpzcEq","pos":[-1,1,5],"texture":"dirt"},{"key":"ZWnO_amzXyzG48_bNJY1V","pos":[0,1,5],"texture":"dirt"},{"key":"3cOjvxHi-cv9Q6V1cWzeB","pos":[-13,1,5],"texture":"dirt"},{"key":"YWTPl3Sh5UiF0G0vlo_2I","pos":[-19,1,4],"texture":"dirt"},{"key":"YcDvgebO26o1DXZ5z7je-","pos":[-23,1,4],"texture":"dirt"},{"key":"F5zW7R66miP8rmtWSBlQR","pos":[-19,2,4],"texture":"dirt"},{"key":"iJ5vWi4Uma7djZNQeGSjh","pos":[-18,1,4],"texture":"dirt"},{"key":"UVA2trl74FpnWycAXJ0SF","pos":[-12,1,5],"texture":"dirt"},{"key":"gfPHYJE8zmTC0fOEh5v2s","pos":[-6,1,5],"texture":"dirt"},{"key":"semuiY1QGpDv0C8MYCkbA","pos":[-5,1,5],"texture":"dirt"},{"key":"znbpz4RA0bRPsbgiGniOX","pos":[-4,1,5],"texture":"dirt"},{"key":"iYlcYME8Sb3VDyXeq8QLs","pos":[-3,1,5],"texture":"dirt"},{"key":"5UYPHxOtXtTA5SbpSLY0l","pos":[-3,2,5],"texture":"dirt"},{"key":"HsVslNGv-RQmKSIkq-AG0","pos":[-2,2,5],"texture":"dirt"},{"key":"ZFLxBYa6EfZh2z6ssFDym","pos":[-12,1,4],"texture":"dirt"},{"key":"dWyWqViEbEkqhApGz4y2Q","pos":[-11,1,4],"texture":"dirt"},{"key":"js30Uf4lD4XTZdoXiPWg5","pos":[-10,1,4],"texture":"dirt"},{"key":"-sWiEvvIoQjMk69vPrWEf","pos":[-10,1,3],"texture":"dirt"},{"key":"iN4AjBc_9PsSbvvybpUNi","pos":[-9,1,3],"texture":"dirt"},{"key":"4_vznG5JmtljWzRWLYcOe","pos":[-8,1,3],"texture":"dirt"},{"key":"bonpH5GYSl9cuqY0UADtF","pos":[-8,1,2],"texture":"dirt"},{"key":"fsWJcu-rhfur3a9QnRGVd","pos":[-7,1,2],"texture":"dirt"},{"key":"lb-xkgCqwAWQ1E5A-wg6u","pos":[-7,1,1],"texture":"dirt"},{"key":"poTGBjCnXzEuXBSHNk1YM","pos":[-6,1,1],"texture":"dirt"},{"key":"lJDjjGWhV-sH3tBKIzHNN","pos":[-5,1,1],"texture":"dirt"},{"key":"kBcvVl9Ecq5QhHfxWvF6-","pos":[-5,1,0],"texture":"dirt"},{"key":"YQZkkPH56oCru5ppeuede","pos":[-4,1,0],"texture":"dirt"},{"key":"NuN39NcLguWoK4qAqEO7Z","pos":[-3,1,0],"texture":"dirt"},{"key":"EaYJIuA_zsVOfK5jr9DDX","pos":[-3,1,-1],"texture":"dirt"},{"key":"U_0Gm11KpNW_1c4j25MLN","pos":[-2,1,-1],"texture":"dirt"},{"key":"hJSdDAf8IX0yMJY_05nWA","pos":[-2,1,-2],"texture":"dirt"},{"key":"ccBexSOtwy4YBz1UD2ZT_","pos":[-1,1,-2],"texture":"dirt"}]');
    }


    const [mostraSalvar, setDivSalvar] = useState(false);
    const [mostraMapas, setDivMapas] = useState(false);


    const abreDivSalvar = () => {setDivSalvar(true); setDivMapas(false); }
    const abreDivMapas = () => { 
        setDivMapas(true); 
        setDivSalvar(false);  

        var url = 'https://rodrigo-kulb.com.br/api-minecraft/pegarDados.php';
        fetch(url, {
          method: 'GET',
          headers:{
            
          }
        }).then(res => res.json())
        .then(async response => {
           
                setListItens(response.data);
        })
        .catch(error => console.error('Error:', error));

     
    }

    const fechaDivSalvar = () => {
        setDivSalvar(false);
    }


return(
    <>
    <div className="botoesCarregar btn" onClick={abreDivMapas} >Abrir Mapa</div>
    <div className="botoesSalvar btn" onClick={abreDivSalvar} >Salvar Mapa</div>
    <div className="botoesZerar btn" ><a href="/" className="linkOff">Novo Mapa</a></div>
    <div className="quadroMapas quadro"  style={{ display: mostraMapas ? "block" : "none" }}>
        <h3>Lista de mapas salvos no servidor</h3>
        <div className="listaDiv">
            {listItens.map(item => (
                <div className="dados" onClick={() => carregaMapaNovo(item.id)}  key={item.key}>{item.nome}</div>
            ))}
        </div>
    </div>
    <div className="quadroSalvar quadro" style={{ display: mostraSalvar ? "block" : "none" }}>
    <div className="fecharBtn" onClick={fechaDivSalvar}>X</div>
      <form onSubmit={handleSubmit(enviarContato)}>
            <h3>Compartilhe seu mapa no servidor</h3>
            <hr></hr>
            <div className="divForm">
                <label>Nome:</label>
                <input placeholder="Digite seu nome" name="nome" className="inputForm" onChange={handleChange}/>
            </div>
            <div className="espaco"></div>
            <div className="divForm">
                <label>Titulo:</label>
                <input  placeholder="Digite um título para o seu mapa" name="titulo"  className="inputForm" onChange={handleChange}/>
            </div>
            <div className="espaco"></div>
            <div className="divForm">
                <div className="flexCenter">
                    <button className="buttonForm" type="submit">{loading ? "Salvando..." : "SALVAR"}</button>
                </div>
            </div>
            <input type="hidden" />
        </form>
    </div>
    </>
)};