package main

import (
	"simulator/entity"
	"simulator/queue"
	"strings"

	"github.com/joho/godotenv"
)

// Register the entity types that this module provides.
func init() {
	err := godotenv.Load()
	if err != nil {
		panic("Error loading .env file")


// Create a new queue.

}

func main () {
	in := make(chan []byte) 
	ch := queue.connect()
	queue.StartConsuming()

	for m := range in  {
		var order entity.Order
		
		err := json.Unmarshal(m, &order)

		if err != nil {
			fmt.Println(err.Error())
			
	}
	fmt.Println("Novo pedido feito:", order.Uuid)

	start(order, ch)


	}




}

func start(order entity.Order, ch *amqp.Channel) {
	go Worker(order, ch)

}

func Worker(order entity.Order, ch *amqp.Channel) {
	f, err := os.Open("destinations/"+order.Destination+".txt")
	if err != nil {
		panic(err.Error())

	}

	defer f.Close()

	scanner := bufio.NewScanner(f)
	for scanner.Scan() {
		data := strings.Split(scanner.Text(), ",")
		json := destination(order, data[0], data[1])

		time.Sleep(2  * time.Second)
		queue.Notify(string(json), ch)

	}

	if err := scanner.Err(); err != nil {
		log.Fatal(err)

	}
	json := destination(order, "0", "0")
	queue.Notify(string(json), ch)

}

func destination(order entity.Order, lat string, lng string) []byte {
	dest := entity.Destination{
		Order: order.Uuid,
		Latitude: lat,
		Longitude: lgn,


	}

	json, _ := json.Marshal(dest)

	return json
} 
	


// Connect to the RabbitMQ server and return a channel to it so we can publish