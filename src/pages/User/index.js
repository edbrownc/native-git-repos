/* eslint-disable react/state-in-constructor */
/* eslint-disable react/static-property-placement */
import React, {Component} from 'react';
import {ActivityIndicator} from 'react-native';
import PropTypes from 'prop-types';
import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
} from './styles';

export default class User extends Component {
  static navigationOptions = ({navigation}) => ({
    title: navigation.getParam('user').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
    }).isRequired,
  };

  state = {
    stars: [],
    page: 1,
    loading: false,
    refreshing: false,
  };

  async componentDidMount() {
    this.setState({loading: true});

    this.loadStars();
  }

  loadStars = async () => {
    const {navigation} = this.props;

    const user = navigation.getParam('user');
    const {page} = this.state;

    const response = await api.get(`/users/${user.login}/starred`, {
      params: {page},
    });

    this.setState({stars: response.data, loading: false});
  };

  loadMore = async () => {
    const {page} = this.state;

    this.setState({page: page + 1});
    this.loadStars();
  };

  refreshList = async () => {
    this.setState({page: 1});

    this.loadStars();
  };

  render() {
    const {navigation} = this.props;
    const {stars, loading, refreshing} = this.state;

    const user = navigation.getParam('user');

    return (
      <Container>
        <Header>
          <Avatar source={{uri: user.avatar}} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <Stars
            onRefresh={this.refreshList}
            refreshing={refreshing}
            onEndReachedThreshold={0.2}
            onEndReached={this.loadMore}
            data={stars}
            keyExtractor={star => String(star.id)}
            renderItem={({item}) => (
              <Starred>
                <OwnerAvatar source={{uri: item.owner.avatar_url}} />
                <Info>
                  <Title>{item.name}</Title>
                  <Author>{item.owner.login}</Author>
                </Info>
              </Starred>
            )}
          />
        )}
      </Container>
    );
  }
}
