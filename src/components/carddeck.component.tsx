import "./carddeck.component.scss";
import { Container, Row, Col } from "react-bootstrap";
import { Card } from "react-bootstrap";

export function CardDeckHeader(props: any) {
  return (
    <Card className="app-card mb-2 p-0">
      <Card.Header>{props.title}</Card.Header>
      {props.children && (
        <Card.Body className="p-2">
          <small>{props.children}</small>
        </Card.Body>
      )}
    </Card>
  );
}

export function CardDeck(props: any) {
  return (
    <Container className="card-deck">
      <Row>{props.children}</Row>
    </Container>
  );
}

export function CardDeckCard(props: any) {
  return <Col {...props}>{props.children}</Col>;
}
