package queue

import (
	"fmt"
	"log"
	"os"

	"github.com/streadway/amqp"
)

func Connect() (*amqp.Channel, error) {
	dsn := "amqp://" + os.Getenv("RABBITMQ_DEFAULT_USER") + ":" + os.Getenv("RABBITMQ_DEFAULT_PASS") + "@" + os.Getenv("RABBITMQ_DEFAULT_HOST") + ":" + os.Getenv("RABBITMQ_DEFAULT_PORT") + os.Getenv("RABBITMQ_DEFAULT_VHOST")
	conn, err := amqp.Dial(dsn)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to RabbitMQ: %v", err)
	}

	ch, err := conn.Channel()
	if err != nil {
		return nil, fmt.Errorf("failed to open a channel: %v", err)
	}
	return ch, nil
}

func StartConsuming(in chan []byte, ch *amqp.Channel) {
	q, err := ch.QueueDeclare(
		os.Getenv("RABBITMQ_CONSUMER_QUEUE"),
		true,
		false,
		false,
		false,
		nil,
	)
	failOnError(err, "Failed to declare a queue")

	msgs, err := ch.Consume(
		q.Name,
		"go-work-simulator",
		true,
		false,
		false,
		false,
		nil,
	)
	failOnError(err, "Failed to register a consumer")

	go func() {
		for m := range msgs {
			in <- []byte(m.Body)
		}
		close(in)
	}()
}

func Notify(payload string, ch *amqp.Channel) {
	err := ch.Publish(
		os.Getenv("RABBITMQ_DESTINATION"),
		os.Getenv("RABBITMQ_DESTINATION_ROUTING_KEY"),
		false,
		false,
		amqp.Publishing{
			ContentType: "application/json",
			Body:        []byte(payload),
		},
	)

	failOnError(err, "Failed to publish a message")
	fmt.Println("Message Sent: ", payload)
}

func failOnError(err error, msg string) {
	if err != nil {
		log.Fatalf("%s: %s", msg, err)
	}
}
