package main

import (
	"fmt"
	"net/http"
	"strconv"
	"os"

	"github.com/jmoiron/sqlx"

	_ "github.com/lib/pq"
)

//DB armazena a conexão com o banco de dados
var DB *sqlx.DB

var timeLayout = "2006-01-02"

func main() {

	port := os.Getenv("SERVER_PORT")
	host := os.Getenv("SERVER_HOST")

	var dbinfo = DbInfo{
		Host: os.Getenv("SERVER_DB_HOST"),
		Port: os.Getenv("SERVER_DB_PORT"),
		Username: os.Getenv("SERVER_DB_USER"),
		Password: os.Getenv("SERVER_DB_PASSWORD"),
		Name: os.Getenv("SERVER_DB_NAME")}

	var err error

	DB, err = OpenConnection(dbinfo)

	if err != nil {
		fmt.Println(
			"Parando a carga do servidor. Erro ao abrir banco de dados: ",
			err)

		return
	}

	HTTPServer(host, port)

	fmt.Printf("Programa finalizado\n")
	defer DB.Close()
}

func HTTPServer(host string, port string) {

	http.HandleFunc("/", Root)
	http.HandleFunc("/Teste", Teste)

	l := host + ":" + port

	fmt.Println("\n\nIniciando servidor em ", l)

	fmt.Println(http.ListenAndServe(l, nil))
}

func Teste(w http.ResponseWriter, r *http.Request) {
	var test = Usuario{Nome: "teste"}
	fmt.Fprintf(w, test.Nome)
}

func Root(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Haro warudo")
}

func OpenConnection(info DbInfo) (db *sqlx.DB, err error) {

	var port = 0

	port, err = strconv.Atoi(info.Port)
	var SQLInfo = fmt.Sprintf(
		"host=%s port=%d user=%s "+
			"password=%s dbname=%s sslmode=disable",
		info.Host, port, info.Username, info.Password, info.Name)

	fmt.Println(SQLInfo)

	db, err = sqlx.Open("postgres", SQLInfo)

	if err != nil {
		fmt.Println("(", info.Name, ") erro ao conectar ao servidor")
		return
	}

	err = db.Ping()

	if err != nil {
		fmt.Println("(", info.Name, ") Erro ao pingar")
		return
	}

	fmt.Println("Conectado ao bd: ", info.Name)

	return
}
