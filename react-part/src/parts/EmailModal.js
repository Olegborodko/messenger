import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const EmailModal = ({ show, handleClose, handleSubmit, handleChange, formData }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Send mail | {formData.idEmail}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formBasicSubject">
            <Form.Label>Subject</Form.Label>
            <Form.Control type="text" placeholder="Enter subject" name="subject" value={formData.subject} onChange={handleChange} />
          </Form.Group>

          <Form.Group controlId="formBasicTextarea">
            <Form.Label>Message</Form.Label>
            <Form.Control as="textarea" rows={3} placeholder="Enter text" name="message" value={formData.message} onChange={handleChange} />
          </Form.Group>
          <br />
          <div className='modal-footer'>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Send
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default EmailModal;
