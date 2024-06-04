import { useForm } from "react-hook-form";
import { api } from "../config_axios";
import { useState } from "react";

const Agendamento = () => {
  const { register, handleSubmit, reset } = useForm();
  const [agendamento, setagendamento] = useState("");

  const salvar = async (campos) => {
    try {
      const response = await api.post("/agendamento/createAgendamento", campos);
      setagendamento(`Agendamento cadastrado com sucesso!"`);
      reset();
    } catch (error) {
      setagendamento("Erro ao cadastrar agendamento!");
    }
  };

  return (
    <div className="container-fluid bg-dark text-light min-vh-100 d-flex align-items-center">
      <div className="container p-5 bg-light text-dark rounded">
        <h4 className="fst-italic mb-3">Faça seu agendamento!</h4>
        <form onSubmit={handleSubmit(salvar)}>
          <div className="form-group">
            <label htmlFor="servico">Serviço</label>
            <select id="servico" {...register("servico")}
              class="form-select" aria-label="Default select example">
              <option selected>Open this select menu</option>
              <option value="1">Nail Design</option>
              <option value="2">Lash Design</option>
              <option value="3">Tratos para o cabelo</option>
            </select>
          </div>
          <div className="form-group mt-2">
            <label htmlFor="descricao">Descrição - caso tenha alergia a algum produto</label>
            <input
              type="text"
              className="form-control"
              id="descricao"
              required
              {...register("descricao")}
            />
          </div>
          <div className="row mt-2">
            <div className="col-sm-4">
              <div className="form-group">
                <label htmlFor="data_agendamento">Data de Agendamento</label>          
                          <input
                            type="datetime-local"
                            className="form-control"
                            id="data_agendamento"
                            required
                            {...register("data_agendamento")}
                            
                          />
                        </div>
                      </div>
                    </div>
                    <input
                      type="submit"
                      className="btn btn-primary mt-3"
                      value="Enviar"
                    />
                    <input
                      type="reset"
                      className="btn btn-danger mt-3 ms-3"
                      value="Limpar"
                    />
                  </form>
                  <div className="alert mt-3">{agendamento}</div>
              </div>
            </div>
            );
};

            export default Agendamento;
