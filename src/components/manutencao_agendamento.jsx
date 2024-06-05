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
            const lista = await api.get("/agendamento/all");
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

const excluir = async(id,servico) => {
    if(!window.confirm(`Confirma a exclusão do Agendamento ${servico}?`)){
        return;
    }
    try{
        console.log("id é:"+id)
        await api.delete(`/agendamento/deleteAgendamento/${id}`);
        //formar uma nova lista de manutencaoAgendamento sem a manutencaoAgendamento que foi excluida
        setManutencaoAgendamento(manutencaoAgendamento.filter(ManutencaoAgendamento => manutencaoAgendamento.id !== id));
        location.reload();
    }catch(error){
        alert(`Erro: ..Não foi possível excluir o agendamento ${servico}: ${error}`);
    }
}

//alterar os registros
const alterar = async (id,servico,index) => {
    const novoservico = prompt(`Digite o novo servico do agendamento ${servico}`);
    if (novoservico == "" ) {
        alert('Digite um servico válido!(servico em branco)')
        return;
    }
    try{//captura os erros 
        //chamando o backend e passando os dados
        await api.put(`/agendamento/updateAgendamento/${id}`,{servico: novoservico});
        
        const manutencaoAgendamentoAtualizados = [...manutencaoAgendamento];
        const indiceManutencaoAgendamento = manutencaoAgendamentoAtualizados.find(ManutencaoAgendamento => ManutencaoAgendamento.id === id);
        console.log("indice manutencaoAgendamento:"+indiceManutencaoAgendamento);
        manutencaoAgendamentoAtualizados[indiceManutencaoAgendamento.id].servico = novoservico;
        setManutencaoAgendamento(manutencaoAgendamentoAtualizados);
        obterLista();
        location.reload();
    }catch(error){
        alert(`Erro: ..Não foi possível alterar o agendamento ${servico}: ${error}`);
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
                        <input type="text" className="form-control" placeholder="servico" required {...register("palavra")} />
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
                        servico={manutencaoAgendamento.servico}
                        descricao={manutencaoAgendamento.descricao}
                        data_agendamento={manutencaoAgendamento.data_agendamento}
                        excluirClick={()=>excluir(manutencaoAgendamento.id,manutencaoAgendamento.servico)}
                        alterarClick={()=>alterar(manutencaoAgendamento.id,manutencaoAgendamento.servico)}
                    />
                ))}
            </tbody>
        </table>
       </div> 
    );
};

export default ManutencaoAgendamento;