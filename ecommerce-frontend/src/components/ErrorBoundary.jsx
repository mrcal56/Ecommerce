import { Component } from 'react';
export default class ErrorBoundary extends Component {
  state={hasError:false}; static getDerivedStateFromError(){return {hasError:true};}
  render(){ return this.state.hasError ? <p>Algo salió mal.</p> : this.props.children; }
}