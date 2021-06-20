package main

import (
	"fmt"
	"net/http"
	"strconv"
	"os"
    "io/ioutil"

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

	rawSqlData, err := ioutil.ReadFile("./sql/schedule_by_stop.sql")
	
	if err != nil {
		fmt.Println("Error reading file schedule_by_stop.sql: ", err)
		return
	}

	scheduleByStopSQL := string(rawSqlData)

	fmt.Println(scheduleByStopSQL)

	DB, err = OpenConnection(dbinfo)

	if err != nil {
		fmt.Println(
			"Stopping the server: error connecting to the databse",
			err)
		return
	}

	HTTPServer(host, port)

	fmt.Printf("Exiting...\n")
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
		fmt.Println("(", info.Name, ") error connecting to the server")
		return
	}

	err = db.Ping()

	if err != nil {
		fmt.Println("(", info.Name, ") ping error")
		return
	}

	fmt.Println("Conected to the database: ", info.Name)

	return
}
