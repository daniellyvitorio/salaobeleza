import {useForm} from "react-hook-form";
import { useState, useEffect } from "react";
import { api } from "../config_axios";
import ItemLista from "./ItemLista";

const ManutencaoAgendamento = () => {
    //servem para manipular os dados do formulário
    const {register, handleSubmit, reset} = useForm();
    //guardar e setar as informações do objeto
    const [manutencaoAgendamento, setManutencaoAgendamento] = useState([]);

    const obterLista = async () => {
        try{
            const lista = await api.get("manutencaoAgendamento");
            setManutencaoAgendamento(lista.data);
        }catch(error){
            alert(`Erro: ..Não foi possível obter os dados: ${error}`);
        }
    }


//define o método que será executado assim que o componente
// for renderizado
useEffect(() => {
    obterLista();
},[]);

const filtrarLista = async (campos) => {
    try{
        const lista = await api.get(`manutencaoAgendamento/filtro/${campos.palavra}`);
        lista.data.length
        ? setManutencaoAgendamento(lista.data)
        : alert("Não há agendamentos cadastrados com a palavra chave pesquisada");
    }catch(error){
        alert(`Erro: ..Não foi possível obter os dados: ${error}`);
    }
}

const excluir = async(id,titulo) => {
    if(!window.confirm(`Confirma a exclusão do Agendamento ${titulo}?`)){
        return;
    }
    try{
        console.log("id é:"+id)
        await api.delete(`manutencaoAgendamento/${id}`);
        //formar uma nova lista de manutencaoAgendamento sem a manutencaoAgendamento que foi excluida
        setManutencaoAgendamento(manutencaoAgendamento.filter(ManutencaoAgendamento => manutencaoAgendamento.id !== id));
        location.reload();
    }catch(error){
        alert(`Erro: ..Não foi possível excluir o agendamento ${titulo}: ${error}`);
    }
}

//alterar os registros
const alterar = async (id,titulo,index) => {
    const novoStatus = prompt(`Digite o novo status do agendamento ${titulo}`);
    if (novoStatus == "" ) {
        alert('Digite um status válido!(status em branco)')
        return;
    }
    try{//captura os erros 
        //chamando o backend e passando os dados
        await api.put(`manutencaoAgendamento/${id}`,{status: novoStatus});
        
        const manutencaoAgendamentoAtualizados = [...manutencaoAgendamento];
        const indiceManutencaoAgendamento = manutencaoAgendamentoAtualizados.find(ManutencaoAgendamento => ManutencaoAgendamento.id === id);
        console.log("indice manutencaoAgendamento:"+indicemanutencaoAgendamento);
        ManutencaoAgendamentoAtualizados[indiceManutencaoAgendamento.id].status = novoStatus;
        setManutencaoAgendamento(ManutencaoAgendamentoAtualizados);
        obterLista();
        location.reload();
    }catch(error){
        alert(`Erro: ..Não foi possível alterar o agendamento ${titulo}: ${error}`);
    }
}

    return (
       <div className="container">
        <div className="row">
            <div className="col-sm-7">
                <h4 className="fst-italic mt-3">Manutenção de Agendamento</h4>
            </div>
            <div className="col-sm-5">
                <form onSubmit={handleSubmit(filtrarLista)}>
                    <div className="input-group mt-3">
                        <input type="text" className="form-control" placeholder="Titulo" required {...register("palavra")} />
                        <input type="submit" className="btn btn-primary" value="Pesquisar" />
                        <input type="button" className="btn btn-danger" value="Todos" onClick={()=>{reset({palavra:""});obterLista();}}/>
                    </div>
                </form>
            </div>
        </div>

        <table className="table table-striped mt-3">
            <thead>
                <tr>
                    <th>Cód.</th>
                    <th>Serviço</th>
                    <th>Descrição</th>
                    <th>Data de Agendamento</th>
                </tr>
            </thead>
            <tbody>
                {manutencaoAgendamento.map((manutencaoAgendamento) => (
                    <ItemLista
                        key={manutencaoAgendamento.id}
                        id={manutencaoAgendamento.id}
                        titulo={manutencaoAgendamento.titulo}
                        descricao={manutencaoAgendamento.descricao}
                        status={manutencaoAgendamento.status}
                        data_criacao={manutencaoAgendamento.data_criacao}
                        data_limite={manutencaoAgendamento.data_limite}
                        excluirClick={()=>excluir(manutencaoAgendamento.id,manutencaoAgendamento.titulo)}
                        alterarClick={()=>alterar(manutencaoAgendamento.id,manutencaoAgendamento.titulo)}
                    />
                ))}
            </tbody>
        </table>

       </div> 
    );
};

export default ManutencaoAgendamento;