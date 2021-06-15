package main

import (
	"fmt"
	"net/http"
	"strconv"

	"os"

	"./models"
	"github.com/jmoiron/sqlx"

	_ "github.com/lib/pq"
)

//DB armazena a conexão com o banco de dados
var DB *sqlx.DB

var timeLayout = "2006-01-02"

func main() {

	port := os.Getenv("SERVER_PORT")
	host := os.Getenv("SERVER_HOST")

	dbhost := os.Getenv("SERVER_DB_HOST")
	dbport := os.Getenv("SERVER_DB_PORT")
	user := os.Getenv("SERVER_DB_USER")
	password := os.Getenv("SERVER_DB_PASSWORD")
	dbname := os.Getenv("SERVER_DB_NAME")

	dh, _ := strconv.Atoi(dbport)

	var err error

	DB, err = OpenConnection(dbhost, dh, user, password, dbname)

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
	var test = models.Usuario{Nome: "teste"}
	fmt.Fprintf(w, test.Nome)
}

func Root(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Haro warudo")
}

func OpenConnection(host string, port int, user string, password string, dbname string) (db *sqlx.DB, err error) {

	var SQLInfo = fmt.Sprintf(
		"host=%s port=%d user=%s "+
			"password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname)

	fmt.Println(SQLInfo)

	db, err = sqlx.Open("postgres", SQLInfo)

	if err != nil {
		fmt.Println("(", dbname, ") erro ao conectar ao servidor")
		return
	}

	err = db.Ping()

	if err != nil {
		fmt.Println("(", dbname, ") Erro ao pingar")
		return
	}

	fmt.Println("Conectado ao bd: ", dbname)

	return
}
