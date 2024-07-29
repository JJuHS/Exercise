import React from 'react';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import FilterForm from './components/FilterForm';
import TagFilter from './components/TagFilter';
import { Container, Row, Col, Card } from 'react-bootstrap';

function App() {
  return (
    <Container className="my-4">
      <Card>
        <Card.Header as="h1" className="text-center">Advanced Task Management App with Zustand</Card.Header>
        <Card.Body>
          <Row className="mb-3">
            <Col md={4}>
              <Card>
                <Card.Header>Filters</Card.Header>
                <Card.Body>
                  <FilterForm />
                  <TagFilter />
                </Card.Body>
              </Card>
            </Col>
            <Col md={8}>
              <Card>
                <Card.Header>Add New Task</Card.Header>
                <Card.Body>
                  <TaskForm />
                </Card.Body>
              </Card>
              <Card className="mt-3">
                <Card.Header>Task List</Card.Header>
                <Card.Body>
                  <TaskList />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default App;
