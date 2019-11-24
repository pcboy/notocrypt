import ReactModal from "react-modal";

class Notocrypt extends Component {
  state = { askPasswordOpened: false };

  componentDidMount() {
    ReactModal.setAppElement("body");
  }

  handleSubmitPassword = e => {
    let formData = new FormData(e.target);
    let password = formData.get("password");
  };

  render() {
    return (
      <div>
        <ReactModal
          closeTimeoutMS={200}
          isOpen={this.askPasswordOpened || false}
          onAfterOpen={}
          onRequestClose={}
          overlayClassName="job_details_modal__overlay"
          className="job_details_modal__content"
        >
          <form onSubmit={this.handleSubmitPassword}>
            <input type="text" value="password"></input>
          </form>
        </ReactModal>
      </div>
    );
  }
}

export default Notocrypt;
