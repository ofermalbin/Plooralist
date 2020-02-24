import React, { Component } from 'react'
import { FlatList, StyleSheet, View } from 'react-native';

import { S3Image } from '../../components';

class PhotosGrid extends Component {
    constructor(props) {
        super(props)

        this.state = {
            photos: [],
            itemHeight: 0,
        }
    }

    componentDidMount() {
      this.setState({
          photos: this.props.photos,
      })
    }

    componentWillReceiveProps(nextProps) {
      this.setState({
        photos: nextProps.photos
      });
    }

    _onLayout = e => {
        const width = e.nativeEvent.layout.width
        this.setState({
            itemHeight: width / 4,
        })
    }

    _getItemLayout = (data, index) => {
        const { itemHeight } = this.state
        return { length: itemHeight, offset: itemHeight * index, index }
    }

    _renderItem = ({ item }) => {
        return (
            <View style={styles.imageContainer}>
              <S3Image
                source={item.source}
                imgKey={item.imgKey}
                level='public'
                width={this.state.itemHeight}
                height={this.state.itemHeight}
                margin={MARGIN}
                backgroundColor='#eee'
                resizeMode='cover'
              />
            </View>
        )
    }

    _extractKey = item => {
        return item.id
    }

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    onLayout={this._onLayout}
                    style={styles.list}
                    columnWrapperStyle={[
                        styles.columnWrapper,
                        { height: this.state.itemHeight },
                    ]}
                    data={this.state.photos}
                    renderItem={this._renderItem}
                    numColumns={4}
                    keyExtractor={this._extractKey}
                    getItemLayout={this._getItemLayout}
                />
            </View>
        )
    }
}

const MARGIN = 2

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'stretch',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    text: {
        textAlign: 'center',
    },
    list: {
        flex: 1,
    },
    columnWrapper: {
        flex: 1,
        flexDirection: 'row',
        marginLeft: -MARGIN,
        marginRight: -MARGIN,
    },
    image: {
        flex: 1,
        width: null,
        height: null,
        margin: MARGIN,
        backgroundColor: '#eee',
    },
    imageContainer: {
        flex: 1,
        alignItems: 'stretch',
    },
})

export default PhotosGrid
