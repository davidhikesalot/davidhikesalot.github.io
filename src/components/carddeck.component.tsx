import "./carddeck.component.scss";
import { Container, Row, Col } from "react-bootstrap";
import { Card } from "react-bootstrap";

export function CardDeckHeader(props: any) {
  return (
    <Card className="card-deck-header">
      {props.title ? (
        <>
          <Card.Header>{props.title}</Card.Header>
          <Card.Body>{props.children}</Card.Body>
        </>
      ) : (
        <>{props.children}</>
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
