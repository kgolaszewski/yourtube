import { 
  Button, 
  Modal, 
  ModalBody,
  ModalHeader,
  ModalFooter,
} from 'reactstrap'

import { useState } from "react";

function CustomModal(props) {

  const [selected, setSelected] = useState("")
  let onSave = props.submitmethod

  return (
    <div>
      <Modal isOpen={props.modal === "true"} toggle={props.toggle}>
        <ModalHeader
          toggle={props.toggle}
        >
          Add a Tag for @{props.youtuber}
        </ModalHeader>
        <ModalBody>
          <p>Select one of your existing video categories and click Submit to add this Youtuber to that feed.</p>
          <select onChange={(e) => {
            setSelected(e.target.value)
          }}>
            {
              props.options.map(category => 
                <option key={category.tag} value={category.id}>{category.tag}</option>
              )
            }
          </select>
        </ModalBody>

        <ModalFooter>
          <Button color="primary" 
            onClick={() => {
              onSave({
                category: props.options.filter(e => e.id === +(selected))[0],
                youtuber: props.youtuber,
              }, props.setFeeds)
              props.toggle()
            }}
          >
            Submit
          </Button>
          <Button color="secondary" onClick={props.toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}

export default CustomModal;