package entity

type Order struct {
	Uuid        string `json:"order"`
	Destination string `json:"destination"`
}

type Destination struct {
	Order     string `json:"order"`
	Latitude  string `json:"lat"`
	Longitude string `json:"lng"`
}