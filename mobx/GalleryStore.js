import {makeAutoObservable, runInAction} from 'mobx';
import {galleryAPI} from "../api/api";
import {apiPageSize} from "../common/const";
import {readFromStorage, writeToStorage} from "../storage/storageApi";

export default class GalleryStore {

    gallery = []
    currentPage = 0

    response = []

    appColumnCount = 1
    appImagesWidth = null

    viewableItems = ''
    stateToStorage = 'не сработал'

    detailPhoto = {
        id: null,
        width: null,
        height: null,
        download_url: null
    }

    base64Images = {}

    constructor() {
        makeAutoObservable(this, {}, {autoBind: true})
    }

    async getNextPage() {
        runInAction(() => {
            this.currentPage++
        })

        const response = await galleryAPI.getGallery(this.currentPage, apiPageSize)
        const pageResponseData = response.data

        runInAction(() => {
            this.response.push(...pageResponseData)
            this.gallery.push(...pageResponseData)
        })

        /*
        for (let photo of pageResponseData) {
            const imageDimensions = calcImageDimensions(this.appImagesWidth, photo.width / photo.height)
            const getImageResponse = await galleryAPI.getImage(photo.id, imageDimensions.width, imageDimensions.height)

            runInAction(() => {
                this.base64Images[photo.id] = `data:${getImageResponse.headers['content-type'].toLowerCase()};base64,${encode(getImageResponse.data)}`
            })
        }
         */
    }

    saveStateToStorage() {
        this.stateToStorage = 'сработал'
        writeToStorage('prefix', 1, 'сработал')
        alert('сработал')
    }

    initializeApp() {
        this.stateToStorage = readFromStorage('prefix', 1)

    }




    setDetailPhoto(photo) {
        this.detailPhoto = {...photo}
    }

    setViewableItems(viewableItems) {
        this.viewableItems = [...viewableItems]
    }

    setAppImagesSize(width) {
        this.appImagesWidth = width
    }

    toggleColumnCount() {
        this.appColumnCount = (this.appColumnCount === 1) ? 2 : 1
    }
}
