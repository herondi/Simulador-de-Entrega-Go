package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"simulator/entity"
	"simulator/queue"
	"strings"
	"time"

	"github.com/joho/godotenv"
	"github.com/streadway/amqp"
)

// Register the entity types that this module provides.
func init() {
	err := godotenv.Load()
	if err != nil {
		panic("Error loading .env file")
	}
}

func main() {
	in := make(chan []byte)
	ch, err := queue.Connect()
	if err != nil {
		log.Fatal("Failed to connect to RabbitMQ:", err)
	}

	queue.StartConsuming(in, ch)

	for m := range in {
		var order entity.Order

		err := json.Unmarshal(m, &order)
		if err != nil {
			fmt.Println("Error unmarshaling order:", err.Error())
			continue
		}

		fmt.Println("Novo pedido feito:", order.Uuid)
		start(order, ch)
	}
}

func start(order entity.Order, ch *amqp.Channel) {
	go Worker(order, ch)
}

func Worker(order entity.Order, ch *amqp.Channel) {
	f, err := os.Open("destinations/" + order.Destination + ".txt")
	if err != nil {
		log.Printf("Error opening destination file: %v", err)
		return
	}

	defer f.Close()

	scanner := bufio.NewScanner(f)
	for scanner.Scan() {
		data := strings.Split(scanner.Text(), ",")
		if len(data) >= 2 {
			json := destination(order, data[0], data[1])
			time.Sleep(2 * time.Second)
			queue.Notify(string(json), ch)
		}
	}

	if err := scanner.Err(); err != nil {
		log.Printf("Error reading destination file: %v", err)
	}

	// Final destination notification
	json := destination(order, "0", "0")
	queue.Notify(string(json), ch)
}

func destination(order entity.Order, lat string, lng string) []byte {
	dest := entity.Destination{
		Order:     order.Uuid,
		Latitude:  lat,
		Longitude: lng,
	}

	json, _ := json.Marshal(dest)
	return json
}

// Connect to the RabbitMQ server and return a channel to it so we can publish
