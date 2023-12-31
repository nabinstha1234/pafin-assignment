import { IPagingArgs, IPagingResult } from '../interfaces/IPagination';

export default class Paging {
  static getPagingArgs(args: any): IPagingArgs {
    let {
      skip = 0,
      limit = 50,
      sort = {
        column: 'created_at',
        order: 'desc',
      },
      ...query
    } = args;

    let { column, order } = sort;
    sort = { [column]: order };
    if (limit > 150) {
      limit = 150;
    }

    return {
      skip: +skip,
      limit: +limit,
      sort,
      query,
    };
  }

  /**
   * @description Get paging result
   * @param args
   * @param data
   * @returns IPagingResult
   */

  static getPagingResult(args: any, data: any): IPagingResult {
    const skip = args.skip || 0;
    const limit = args.limit || 10;
    const total = data.total;
    const endIndex = +skip + +limit - 1;

    return {
      total,
      startIndex: +skip,
      endIndex: endIndex > total - 1 ? total - 1 : endIndex,
      hasNextPage: skip + limit < total ? true : false,
    };
  }
}
