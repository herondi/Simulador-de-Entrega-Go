package main

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"os"

	"github.com/gorilla/mux"
)

// Struct Driver representa um motorista
type Driver struct {
	Uuid  string `json:"uuid"`
	Name  string `json:"name"`
	Email string `json:"email"`
}

// Struct Drivers contém uma lista de motoristas
type Drivers struct {
	Drivers []Driver
}

// Função getDrivers lê os dados do arquivo "data.json" e retorna os bytes dos dados
func getDrivers() []byte {
	jsonFile, err := os.Open("data.json")
	if err != nil {
		panic(err.Error())
	}
	defer jsonFile.Close()

	data, err := ioutil.ReadAll(jsonFile)
	if err != nil {
		panic(err.Error())
	}

	return data
}

// Função ShowDrivers é um handler para a rota "/drivers" que retorna todos os motoristas
func ShowDrivers(w http.ResponseWriter, r *http.Request) {
	drivers := getDrivers()
	w.Write([]byte(drivers))
}

// Função getDriversByUuid é um handler para a rota "/drivers/{uuid}" que retorna um motorista específico com base no UUID fornecido
func getDriversByUuid(w http.ResponseWriter, r *http.Request) {
	query := mux.Vars(r)
	data := getDrivers()

	var drivers Drivers
	err := json.Unmarshal(data, &drivers)
	if err != nil {
		panic(err.Error())
	}

	for _, d := range drivers.Drivers {
		if d.Uuid == query["uuid"] {
			driver, _ := json.Marshal(d)
			w.Write([]byte(driver))
			return
		}
	}

	w.Write([]byte("Não encontrado"))
}

func main() {
	r := mux.NewRouter()

	// HandleFunc para a rota "/drivers" que chama a função ShowDrivers
	r.HandleFunc("/drivers", ShowDrivers)

	// HandleFunc para a rota "/drivers/{uuid}" que chama a função getDriversByUuid
	r.HandleFunc("/drivers/{uuid}", getDriversByUuid)

	// Inicia o servidor HTTP na porta 8081 usando o roteador r
	http.ListenAndServe(":8081", r)
}