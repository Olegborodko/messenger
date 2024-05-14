import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import OpenAiBtn from './OpenAIBtn';
import SpeechGoogleBtn from './SpeechGoogleBtn';

const EmailModal = ({ show, handleClose, handleSubmit, handleChange, formData, handleTranscription, handleOpenAiBtnClick }) => {
  const [fieldsIsEmpty, setFieldsIsEmpty] = useState(true);

  useEffect(() => {
    if (formData.message.length > 0) {
      setFieldsIsEmpty(false);
    } else {
      setFieldsIsEmpty(true);
    }
  }, [formData]);

  let disableBtn = fieldsIsEmpty ? "disabled" : "";

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Send mail to {formData.fromEmail}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formBasicTextarea">
            <Form.Label>Message *</Form.Label>
            <Form.Control as="textarea" rows={3} placeholder="Enter text" name="message" value={formData.message} onChange={handleChange} className={fieldsIsEmpty ? 'is-invalid' : ''} />
          </Form.Group>

          <input type="hidden" name="emailTo" value={formData.fromEmail} />
          <br />
          <div className='modal-footer'>
            {/* <Button variant="secondary" onClick={handleClose}>
              Close
            </Button> */}
            {/* <WebSpeeshBtn onChangeTranscription={handleTranscription} /> */}
            <SpeechGoogleBtn onChangeTranscription={handleTranscription} />
            <OpenAiBtn data={formData.message} handleOpenAiBtnClick={handleOpenAiBtnClick} />
            <Button variant="primary" type="submit" disabled={fieldsIsEmpty}>
              Send
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default EmailModal;
