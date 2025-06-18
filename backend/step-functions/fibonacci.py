import json

def lambda_handler(event, context):
    n_2 = event.get('n_2', 0)
    n_1 = event.get('n_1', 0)
    n = event.get('n', 0)
    target = event['target']
    current_value = n_2 + n_1
    if n == target:
        return {
            'n_2': n_2,
            'n_1': n_1,
            'n': n,
            'target': target,
            'result': current_value
        }
    else:
        return {
            'n_2': n_1,
            'n_1': current_value,
            'n': n + 1,
            'target': target
        }
