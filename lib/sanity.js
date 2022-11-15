import {createClient,createPreviewSubscriptionHook } from "next-sanity";
import createImageUrlBuilder from '@sanity/image-url';
import {PortableText} from '@portabletext/react'

const config = {
    projectId:"147yz3s7",
    dataset:"production",
    apiVersion:"2021-03-25",  
    useCdn:false
 }

export const sanityClient = createClient(config);
export const usePreviewSubscription = createPreviewSubscriptionHook(config);
export const urlFor = (source) => createImageUrlBuilder(config).image(source);