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

  err := OpenConnection(dbinfo)

  if err != nil {
    fmt.Println("Error connecting to the database: ", err)
    return
  }

  HTTPServer(host, port)

  fmt.Printf("Exiting...\n")
  defer DB.Close()
}

func HTTPServer(host string, port string) {

  http.HandleFunc("/", Root)
  http.HandleFunc("/GetBusScheduling", GetBusScheduling)

  l := host + ":" + port

  fmt.Println("\n\nIniciando servidor em ", l)

  fmt.Println(http.ListenAndServe(l, nil))
}

func GetPassagengers(w http.ResponseWriter, r *http.Request) {

  passengerParameter := r.URL.Query().Get("bus")

  rawSqlData, err := ioutil.ReadFile("./sql/number_passengers.sql")

  if err != nil {
    fmt.Println("Error readinf file number_passengers.sql", err);
    return
  }

  numberOfPassengersSQL := string(rawSqlData)

  row, err := DB.Queryx(numberOfPassengersSQL, passengerParameter);

  if err != nil {
    fmt.Println("Error running number_passengerssql", err)
    return
  }

  var bus Bus

  for rows.Next() {
    err = rows.StructScan(&bus)
  }

  if err != nil {
    fmt.Println("Error unmarshaling the rows: ", err)
    return
  }

  fmt.Fprintf(w, Format(bus))
}

func GetBusScheduling(w http.ResponseWriter, r *http.Request) {

  lineBus := LineBus{IdBus: r.URL.Query().Get("bus"), IdLine: r.URL.Query().Get("line")}

  rawSqlData, err := ioutil.ReadFile("./sql/schedule_by_stop.sql")
  
  if err != nil {
	  fmt.Println("Error reading file schedule_by_stop.sql: ", err)
	  return
	}
	
	scheduleByStopSQL := string(rawSqlData)
	
	rows, err := DB.Queryx(scheduleByStopSQL, lineBus.IdBus, lineBus.IdLine)
	
	if err != nil {
		fmt.Println("Error running scheduleByStopSQL: ", err)
		return  
	}
	
	for rows.Next() {
		err = rows.StructScan(&lineBus)
	}
	
	if err != nil {
		fmt.Println("Error reading the schedule response", err)
		return
	}
	
  fmt.Fprintf(w, Format(lineBus));
}

func Root(w http.ResponseWriter, r *http.Request) {
  fmt.Fprintf(w, "Haro warudo")
}

func OpenConnection(info DbInfo) (err error) {

  var port = 0

  port, err = strconv.Atoi(info.Port)
  var SQLInfo = fmt.Sprintf(
    "host=%s port=%d user=%s "+
      "password=%s dbname=%s sslmode=disable",
    info.Host, port, info.Username, info.Password, info.Name)

  fmt.Println(SQLInfo)

  DB, err = sqlx.Open("postgres", SQLInfo)

  if err != nil {
    fmt.Println("(", info.Name, ") error connecting to the server")
    return
  }

  err = DB.Ping()

  if err != nil {
    fmt.Println("(", info.Name, ") ping error")
  } else {
    fmt.Println("Conected to the database: ", info.Name)
  }

  return
}
