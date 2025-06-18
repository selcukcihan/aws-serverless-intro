{
  "Comment": "Compute the Nth Fibonacci number using Lambda and Step Functions",
  "StartAt": "Initialize",
  "States": {
    "Initialize": {
      "Type": "Pass",
      "Result": {
        "n_2": 0,
        "n_1": 1,
        "n": 2,
        "target": 5
      },
      "ResultPath": "$",
      "Next": "CalculateFibonacci"
    },
    "CalculateFibonacci": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:us-east-1:195275674349:function:fibo",
      "ResultPath": "$.lambdaResult",
      "Next": "CheckIfDone"
    },
    "CheckIfDone": {
      "Type": "Choice",
      "Choices": [
        {
          "Variable": "$.lambdaResult.result",
          "IsPresent": true,
          "Next": "Done"
        }
      ],
      "Default": "PrepareNextIteration"
    },
    "PrepareNextIteration": {
      "Type": "Pass",
      "Parameters": {
        "n_2.$": "$.lambdaResult.n_2",
        "n_1.$": "$.lambdaResult.n_1",
        "n.$": "$.lambdaResult.n",
        "target.$": "$.lambdaResult.target"
      },
      "ResultPath": "$",
      "Next": "CalculateFibonacci"
    },
    "Done": {
      "Type": "Pass",
      "Parameters": {
        "FibonacciResult.$": "$.lambdaResult.result"
      },
      "End": true
    }
  }
}
