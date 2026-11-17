/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface PublishShareholderDto {
  shortDescription: string;
  /** @min 0 */
  ownershipShare: number;
  /** @min 0 */
  preferredShare: number;
}

export interface LikeDto {
  value: 0 | 1;
}

export interface RegisterUserDto {
  login: string;
  /** @minLength 6 */
  password: string;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title MoneyM API — Сумма дивидендов
 * @version 4.0
 * @contact
 *
 * Акционеры МКПАО «Яндекс». Сессии в Redis, кука sessionId.
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  shareholders = {
    /**
     * No description
     *
     * @tags Акционеры
     * @name GetShareholdersList
     * @request GET:/api/shareholders
     */
    getShareholdersList: (
      query?: {
        minShare?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/shareholders`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Акционеры
     * @name AddShareholderDraft
     * @request POST:/api/shareholders
     * @secure
     */
    addShareholderDraft: (
      data: {
        fullName: string;
        /** @format binary */
        image?: File;
        /** @format binary */
        video?: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/shareholders`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Акционеры
     * @name GetShareholderFeed
     * @request GET:/api/shareholders/feed
     */
    getShareholderFeed: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/shareholders/feed`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Акционеры
     * @name GetShareholderFeedById
     * @request GET:/api/shareholders/feed/{id}
     */
    getShareholderFeedById: (
      id: number,
      query?: {
        next?: "true" | "false";
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/shareholders/feed/${id}`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Акционеры
     * @name GetShareholderDraft
     * @request GET:/api/shareholders/draft
     * @secure
     */
    getShareholderDraft: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/shareholders/draft`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Акционеры
     * @name PublishShareholder
     * @request PUT:/api/shareholders/{id}/publish
     * @secure
     */
    publishShareholder: (
      id: number,
      data: PublishShareholderDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/shareholders/${id}/publish`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Акционеры
     * @name DeleteShareholder
     * @request DELETE:/api/shareholders/{id}
     * @secure
     */
    deleteShareholder: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/shareholders/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Акционеры
     * @name LikeShareholder
     * @request POST:/api/shareholders/{id}/like
     * @secure
     */
    likeShareholder: (id: number, data: LikeDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/shareholders/${id}/like`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  users = {
    /**
     * No description
     *
     * @tags Пользователи
     * @name RegisterUser
     * @request POST:/api/users/register
     */
    registerUser: (data: RegisterUserDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/users/register`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Пользователи
     * @name LoginUser
     * @request POST:/api/users/login
     */
    loginUser: (data: RegisterUserDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/users/login`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Пользователи
     * @name LogoutUser
     * @request POST:/api/users/logout
     * @secure
     */
    logoutUser: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/users/logout`,
        method: "POST",
        secure: true,
        ...params,
      }),
  };
}
