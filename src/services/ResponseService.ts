export class ResponseService {
    static success = (data: object | string) => {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            body: ResponseService.generateBody(data, null, true)
        }
    }

    static error = (message: string, statusCode: number) => {
        return {
            statusCode: statusCode,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: ResponseService.generateBody(null, message, false)      
        }
    }

    static csv = (data: string) => {
        return {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
                'Content-Type': 'text/csv'
            },
            body: data
        }
    }

    static generateBody = (data: object| string | null, error: string | null, success: boolean): string => {
        let body =  {
            data: data,
            error: error,
            success: success
        }

        return JSON.stringify(body);
    } 
}